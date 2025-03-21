import { ButtondownAPI } from "./buttondown";

async function testAnalytics() {
  try {
    const api = new ButtondownAPI();
    await api.initialize(); // This will get the API key from 1Password

    console.log("\n=== Email Analytics Overview ===");
    const emailsData = await api.getEmailAnalytics();

    // Print summary stats
    const totalEmails = emailsData.count;
    const totalOpens = emailsData.results.reduce(
      (sum, email) => sum + (email.analytics?.opens || 0),
      0
    );
    const totalClicks = emailsData.results.reduce(
      (sum, email) => sum + (email.analytics?.clicks || 0),
      0
    );
    const totalRecipients = emailsData.results.reduce(
      (sum, email) => sum + (email.analytics?.recipients || 0),
      0
    );

    console.log(`\nTotal Emails: ${totalEmails}`);
    console.log(`Total Opens: ${totalOpens}`);
    console.log(`Total Clicks: ${totalClicks}`);
    console.log(`Total Recipients: ${totalRecipients}`);

    console.log("\n=== Individual Email Stats ===");
    emailsData.results.forEach((email) => {
      console.log(`\nEmail: ${email.subject}`);
      console.log(`Sent: ${email.publish_date}`);
      console.log(`Recipients: ${email.analytics?.recipients || 0}`);
      console.log(`Opens: ${email.analytics?.opens || 0}`);
      console.log(`Clicks: ${email.analytics?.clicks || 0}`);
      console.log(
        `Page Views (Lifetime): ${email.analytics?.page_views__lifetime || 0}`
      );
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

testAnalytics();
