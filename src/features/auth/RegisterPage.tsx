import { useState, type FormEvent } from "react";
import { Button } from "../../shared/components/Button";
import { useAuth } from "./AuthContext";

type RegisterPageProps = {
  onDone: () => void;
  onLogin: () => void;
};

export function RegisterPage({ onDone, onLogin }: RegisterPageProps) {
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    try {
      await auth.register({ email, displayName, password });
      onDone();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Registration failed");
    }
  };

  return (
    <main className="page narrow-page">
      <form className="panel settings-form" onSubmit={submit}>
        <div className="page-heading">
          <h2>Register</h2>
          <p>Create an account to save progress.</p>
        </div>
        <label className="field">
          <span>Email</span>
          <input className="number-input" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label className="field">
          <span>Display name</span>
          <input className="number-input" value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
        </label>
        <label className="field">
          <span>Password</span>
          <input className="number-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <div className="button-row">
          <Button type="submit">Register</Button>
          <Button className="secondary-button" type="button" onClick={onLogin}>
            Login
          </Button>
        </div>
      </form>
    </main>
  );
}
