export default function EmailVerificationBanner() {
  const { user } = useAuth();
  const [sent, setSent] = useState(false);

  const resendVerification = async () => {
    await api.post("/auth/verify/resend");
    setSent(true);
  };

  if (user?.verified) return null;

  return (
    <div className="verification-banner">
      <p>Please verify your email address</p>
      <button onClick={resendVerification} disabled={sent}>
        {sent ? "Email Sent!" : "Resend Verification Email"}
      </button>
    </div>
  );
}
