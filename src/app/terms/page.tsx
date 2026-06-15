import { Metadata } from "next";
import StaticPageLayout from "@/components/StaticPageLayout";

export const metadata: Metadata = {
  title: "Terms & Conditions | What To Watch",
  description: "Terms and conditions of use for the What To Watch recommendation engine.",
};

export default function TermsPage() {
  return (
    <StaticPageLayout title="Terms & Conditions" subtitle="Legal Agreements and Guidelines">
      <p>
        Welcome to <strong>WhatToWatch</strong>. By accessing or using our website, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access our service.
      </p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        These Terms and Conditions govern your use of the WhatToWatch website and its recommendation services. By using our application, you acknowledge that you have read, understood, and agree to be bound by these terms.
      </p>

      <h2>2. Service Description</h2>
      <p>
        WhatToWatch is an online movie and television show recommendation engine (an &quot;online ruler&quot; for media). We curate, filter, and randomly select media titles based on user-provided criteria (such as mood, time, and genre). We do not host, stream, or distribute any copyright-protected media files. We merely provide metadata, imagery, and outbound links to legitimate streaming platforms.
      </p>

      <h2>3. Intellectual Property</h2>
      <p>
        The movie posters, titles, and descriptions displayed on this site are the property of their respective copyright holders. WhatToWatch uses this data for informational and recommendation purposes under fair use principles. The design, code, and original content of WhatToWatch are protected by intellectual property laws.
      </p>

      <h2>4. Disclaimer of Warranties</h2>
      <p>
        Our service is provided &quot;as is&quot; without any warranties, expressed or implied. We do not guarantee that:
      </p>
      <ul>
        <li>The recommendations will always perfectly match your expectations.</li>
        <li>The streaming links provided will always be active or available in your specific geographic region.</li>
        <li>The site will be entirely error-free or uninterrupted.</li>
      </ul>

      <h2>5. Limitation of Liability</h2>
      <p>
        In no event shall WhatToWatch or its creators be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of or inability to use the service.
      </p>

      <h2>6. Modifications</h2>
      <p>
        We reserve the right to modify or replace these Terms at any time. Your continued use of the service after any such changes constitutes your acceptance of the new Terms.
      </p>
    </StaticPageLayout>
  );
}
