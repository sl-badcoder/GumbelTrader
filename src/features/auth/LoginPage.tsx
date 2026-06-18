import { useState, type FormEvent } from "react";
import { Button } from "../../shared/components/Button";
import { useAuth } from "./AuthContext";

type LoginPageProps = {
  onDone: () => void;
  onRegister: () => void;
};

export function LoginPage({ onDone, onRegister }: LoginPageProps) {
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    try {
      await auth.login({ email, password });
      onDone();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Login failed");
    }
  };

  return (
    <main className="page narrow-page">
      <form className="panel settings-form" onSubmit={submit}>
        <div className="page-heading">
          <h2>Login</h2>
          <p>Log in to save results and view statistics.</p>
        </div>
        <label className="field">
          <span>Email</span>
          <input className="number-input" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label className="field">
          <span>Password</span>
          <input className="number-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <div className="button-row">
          <Button type="submit">Login</Button>
          <Button className="secondary-button" type="button" onClick={onRegister}>
            Register
          </Button>
        </div>
      </form>
    </main>
  );
}
