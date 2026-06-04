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
  budget: z.enum(["", "under_8k", "8_20k", "20_50k", "over_50k"]).optional(),
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
          try {
            const env = await getDevEnv();
            const db = getDb(env);
            
            // Check for duplicate submission (same email within last hour)
            const recentContact = await db
              .prepare(`SELECT id FROM contacts WHERE email = ? AND created_at > unixepoch() - 3600 LIMIT 1`)
              .bind(email)
              .first<{ id: number }>();
            
            if (recentContact) {
              console.log(`Duplicate submission detected for ${email}`);
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
            console.log(`Contact saved to database with ID: ${contactId}`);
          } catch (dbError) {
            // Log but don't fail the request - email is more important
            console.error("Database error (non-fatal):", dbError);
          }

          // Fallback: if Resend not configured, still accept and return success
          const apiKey = process.env.RESEND_API_KEY;
          if (!apiKey || apiKey.includes("placeholder")) {
            console.log("Contact form submitted (no Resend configured)");
            return new Response(JSON.stringify({ success: true, fallback: true, contactId }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          const resend = new Resend(apiKey);
          const sendResult = await resend.emails.send({
            from: "noreply@sepehr.am",
            to: "hello@sepehr.am",
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

          if (sendResult.error) {
            console.error("Resend error:", sendResult.error);
            return new Response(
              JSON.stringify({ error: "Failed to send email" }),
              { status: 500, headers: { "Content-Type": "application/json" } }
            );
          }

          return new Response(JSON.stringify({ success: true, emailId: sendResult.data?.id, contactId }), {
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
