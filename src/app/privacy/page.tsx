import { Metadata } from "next";
import StaticPageLayout from "@/components/StaticPageLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | Watch That Next",
  description: "Privacy Policy for Watch That Next. Learn how we handle your data and protect your privacy.",
};

export default function PrivacyPage() {
  return (
    <StaticPageLayout title="Privacy Policy" subtitle="Last Updated: October 2023">
      <p>
        At <strong>Watch That Next</strong>, we respect your privacy and are committed to protecting it through our compliance with this policy. This Privacy Policy describes the types of information we may collect from you or that you may provide when you visit the website, and our practices for collecting, using, maintaining, protecting, and disclosing that information.
      </p>

      <h2>1. Information We Collect</h2>
      <p>
        We do not collect any personally identifiable information (PII) unless you voluntarily provide it to us. The core functionality of our recommendation engine runs entirely in your browser without requiring you to create an account or log in.
      </p>
      <ul>
        <li><strong>Local Storage:</strong> We use your browser&apos;s local storage to save your &quot;Watchlist&quot; and basic viewing history so you don&apos;t lose your favorite recommendations. This data never leaves your device.</li>
        <li><strong>Usage Data:</strong> We may collect anonymous, aggregated usage data (such as page views or spin counts) to improve our recommendation algorithms and user experience.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>
        Any anonymous information we collect is used strictly to:
      </p>
      <ul>
        <li>Improve our website&apos;s performance and user interface.</li>
        <li>Understand general trends in what types of movies and shows users are searching for.</li>
        <li>Ensure the technical stability of our roulette and wizard features.</li>
      </ul>

      <h2>3. Third-Party Services</h2>
      <p>
        Our website contains links to third-party streaming services (e.g., Netflix, Hulu, Amazon Prime). When you click &quot;Watch Now,&quot; you are directed to these external sites. We are not responsible for the privacy practices or the content of these third-party websites. Please review their privacy policies before providing them with any personal information.
      </p>

      <h2>4. Changes to Our Privacy Policy</h2>
      <p>
        It is our policy to post any changes we make to our privacy policy on this page. If we make material changes to how we treat our users&apos; information, we will notify you through a prominent notice on the website&apos;s home page.
      </p>

      <h2>5. Contact Information</h2>
      <p>
        To ask questions or comment about this privacy policy and our privacy practices, please contact us via our <a href="/contact">Contact Us</a> page.
      </p>
    </StaticPageLayout>
  );
}
