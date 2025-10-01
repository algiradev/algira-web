import FeedbackForm from "@/components/feedback-form/FeedbackForm";
import ContactFeedbackForm from "@/components/contact-form/ContactForm";
import styles from "./page.module.css";
import HomePage from "./home/page";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <HomePage />
      <div className={styles.contactSection}>
        <FeedbackForm />
        <ContactFeedbackForm />
      </div>
    </main>
  );
}
