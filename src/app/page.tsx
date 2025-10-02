import FeedbackForm from "@/components/feedback-form/FeedbackForm";
import ContactFeedbackForm from "@/components/contact-form/ContactForm";
import styles from "./page.module.css";
import HomePage from "./home/page";
import Slider from "@/components/slider/Slider";
import Comments from "@/components/comments/Comments";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <Slider />
      <HomePage />
      <div className={styles.contactSection}>
        <FeedbackForm />
        <ContactFeedbackForm />
      </div>

      <Comments />
    </main>
  );
}
