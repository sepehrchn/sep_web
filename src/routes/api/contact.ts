import { createFileRoute } from "@tanstack/react-router";
import { Resend } from "resend";
import { z } from "zod";
import { escapeHtml } from "@/lib/sanitize";
import { checkRequestSize, checkOrigin } from "@/lib/request-validation";
import { getDb } from "@/lib/db/client";
import { insertContact } from "@/lib/db/queries";
import { getDevEnv } from "@/lib/platform";

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  company: z.string().max(100).optional(),
  project: z.string().min(20).max(2000),
  // Updated budget tiers to reflect current public knowledge/pricing
  budget: z
    .enum(["", "under_100", "100_300", "300_500", "500_1000", "over_1000"])
    .optional(),
});

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Security checks
        const sizeCheck = checkRequestSize(request);
        if (sizeCheck) return sizeCheck;
        
        const originCheck = checkOrigin(request);
        if (originCheck) return originCheck;

        try {
          const body = await request.json();
          const result = contactSchema.safeParse(body);
          if (!result.success) {
            return new Response(
              JSON.stringify({ error: "Validation failed", errors: result.error.flatten().fieldErrors }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          const { name, email, company, project, budget } = result.data;

          // Save to database (best effort - don't block email)
          let contactId: number | undefined;
          let env: any;
          try {
            env = await getDevEnv();
            const db = getDb(env);
            
            // Check for duplicate submission (same email within last hour)
            const recentContact = await db
              .prepare(`SELECT id FROM contacts WHERE email = ? AND created_at > unixepoch() - 3600 LIMIT 1`)
              .bind(email)
              .first<{ id: number }>();
            
            if (recentContact) {
              return new Response(
                JSON.stringify({ error: "You already submitted a request recently. We'll respond shortly." }),
                { status: 429, headers: { "Content-Type": "application/json" } }
              );
            }

            contactId = await insertContact(db, {
              name,
              email,
              company,
              project,
              budget,
            });
          } catch (dbError) {
            // Log but don't fail the request - email is more important
            console.error("Database error (non-fatal):", dbError);
          }

          // Email notification — non-blocking, never fails the request
          try {
            const resendKey = (env?.RESEND_API_KEY || process.env.RESEND_API_KEY) as string | undefined;
            if (resendKey) {
              const resend = new Resend(resendKey);

              const budgetLabels: Record<string, string> = {
                under_100: 'Under $100',
                '100_300': '$100 – $300',
                '300_500': '$300 – $500',
                '500_1000': '$500 – $1,000',
                over_1000: 'Over $1,000',
              };

              await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: 'sepehrjokanian99@gmail.com',
                replyTo: email,
                subject: `New inquiry from ${name}`,
                html: `
                  <div style="font-family:sans-serif;max-width:600px;margin:0 auto;
                              background:#0f0f0f;color:#e5e5e5;padding:32px;
                              border-radius:12px;border:1px solid #222;">
                    <h2 style="color:#6366f1;margin:0 0 24px;">
                      New Project Inquiry
                    </h2>
                    <table style="width:100%;border-collapse:collapse;">
                      <tr>
                        <td style="padding:10px 0;color:#888;width:130px;
                                   border-bottom:1px solid #222;">Name</td>
                        <td style="padding:10px 0;font-weight:600;
                                   border-bottom:1px solid #222;">
                          ${escapeHtml(name)}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;color:#888;
                                   border-bottom:1px solid #222;">Email</td>
                        <td style="padding:10px 0;border-bottom:1px solid #222;">
                          <a href="mailto:${escapeHtml(email)}"
                             style="color:#6366f1;">
                            ${escapeHtml(email)}
                          </a>
                        </td>
                      </tr>
                      ${company ? `
                      <tr>
                        <td style="padding:10px 0;color:#888;
                                   border-bottom:1px solid #222;">Company</td>
                        <td style="padding:10px 0;border-bottom:1px solid #222;">
                          ${escapeHtml(company)}
                        </td>
                      </tr>` : ''}
                      ${budget ? `
                      <tr>
                        <td style="padding:10px 0;color:#888;
                                   border-bottom:1px solid #222;">Budget</td>
                        <td style="padding:10px 0;border-bottom:1px solid #222;">
                          ${budgetLabels[budget] || budget}
                        </td>
                      </tr>` : ''}
                      <tr>
                        <td style="padding:10px 0;color:#888;
                                   vertical-align:top;
                                   border-bottom:1px solid #222;">Project</td>
                        <td style="padding:10px 0;border-bottom:1px solid #222;
                                   line-height:1.6;">
                          ${escapeHtml(project).replace(/\n/g, '<br>')}
                        </td>
                      </tr>
                      ${contactId ? `
                      <tr>
                        <td style="padding:10px 0;color:#888;">DB ID</td>
                        <td style="padding:10px 0;font-family:monospace;
                                   color:#6366f1;">#${contactId}</td>
                      </tr>` : ''}
                    </table>
                    <div style="margin-top:32px;padding-top:24px;
                                border-top:1px solid #222;">
                      <a href="https://sep-web.pages.dev/admin"
                         style="display:inline-block;background:#6366f1;
                                color:white;padding:10px 20px;border-radius:8px;
                                text-decoration:none;font-size:14px;">
                        View in Admin Dashboard →
                      </a>
                    </div>
                    <p style="margin-top:24px;color:#555;font-size:12px;">
                      Hit Reply to respond directly to ${escapeHtml(name)}.
                    </p>
                  </div>
                `,
              });
            }
          } catch (emailErr) {
            console.error('Email notification failed (non-fatal):', emailErr);
          }

          // Second attempt using same env-derived key (non-fatal). Always return success.
          try {
            const apiKey = (env?.RESEND_API_KEY || process.env.RESEND_API_KEY) as string | undefined;
            if (!apiKey || (typeof apiKey === 'string' && apiKey.includes('placeholder'))) {
              return new Response(JSON.stringify({ success: true, contactId }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
              });
            }

            const resend2 = new Resend(apiKey);
            await resend2.emails.send({
              from: "noreply@sepehr.am",
              to: "sepehrjokanian99@gmail.com",
              subject: `New project inquiry from ${escapeHtml(name)}`,
              html: `
                <h2>New Inquiry</h2>
                <p><strong>Name:</strong> ${escapeHtml(name)}</p>
                <p><strong>Email:</strong> ${escapeHtml(email)}</p>
                ${company ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>` : ""}
                <p><strong>Project:</strong></p>
                <p>${escapeHtml(project).replace(/\n/g, "<br>")}</p>
                ${budget ? `<p><strong>Budget Range:</strong> ${escapeHtml(budget)}</p>` : ""}
                ${contactId ? `<p><em>Database ID: ${contactId}</em></p>` : ""}
              `,
            });
          } catch (err) {
            console.error('Resend error (non-fatal):', err);
          }

          return new Response(JSON.stringify({ success: true, contactId }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          console.error("Contact API error:", err);
          return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});
