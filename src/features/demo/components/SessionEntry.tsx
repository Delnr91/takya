"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye, ShieldCheck } from "lucide-react";
import { profileSchema, type Role } from "../schemas/simulation";
import { beginPractice } from "../model/profile";
import { Pictogram } from "./DemoPrimitives";
import "./demo.css";

export function SessionEntry() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("OPERATOR");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  return (
    <main className="demo-shell demo-entry">
      <div className="demo-backdrop" aria-hidden="true">
        <Image src="/background2.png" alt="" fill sizes="100vw" />
        <div className="demo-backdrop-wash" />
      </div>
      <section className="demo-panel demo-entry-card">
        <Link href="/home" className="demo-back">
          <ArrowLeft size={17} aria-hidden="true" />
          Volver al inicio
        </Link>
        <Image
          src="/brand/principal-bosque.svg"
          alt="TAKYA"
          width={180}
          height={44}
          className="demo-logo"
          priority
        />
        <p className="demo-eyebrow">Acceso de práctica</p>
        <h1>
          Tu criterio.
          <br />
          Una nueva perspectiva.
        </h1>
        <p>Elige cómo quieres participar en la simulación.</p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const result = profileSchema.safeParse({
              name:
                name.trim() ||
                (role === "OPERATOR" ? "Operador 03" : "Supervisión 01"),
              role,
            });
            if (!result.success) {
              setError(
                result.error.issues[0]?.message ??
                  "Revisa tu nombre de práctica.",
              );
              return;
            }
            beginPractice(result.data);
            router.replace("/demo");
          }}
        >
          <fieldset className="demo-role-options">
            <legend>Tu rol en este ejercicio</legend>
            <label className={role === "OPERATOR" ? "is-selected" : ""}>
              <input
                type="radio"
                name="role"
                value="OPERATOR"
                checked={role === "OPERATOR"}
                onChange={() => setRole("OPERATOR")}
              />
              <Pictogram icon={Eye} small />
              <span>
                <strong>Operador</strong>
                <small>Observa, comprende y decide.</small>
              </span>
            </label>
            <label className={role === "SUPERVISOR" ? "is-selected" : ""}>
              <input
                type="radio"
                name="role"
                value="SUPERVISOR"
                checked={role === "SUPERVISOR"}
                onChange={() => setRole("SUPERVISOR")}
              />
              <Pictogram icon={ShieldCheck} small />
              <span>
                <strong>Supervisión</strong>
                <small>Recibe derivaciones y revisa el historial.</small>
              </span>
            </label>
          </fieldset>
          <label className="demo-field">
            Nombre de práctica <span className="demo-muted">(opcional)</span>
            <input
              type="text"
              value={name}
              maxLength={32}
              placeholder={
                role === "OPERATOR" ? "Operador 03" : "Supervisión 01"
              }
              onChange={(event) => setName(event.target.value)}
              autoComplete="off"
            />
          </label>
          {error ? (
            <p className="demo-error" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" className="demo-button demo-button-primary">
            Entrar a la práctica
            <ArrowRight aria-hidden="true" />
          </button>
        </form>
        <p className="demo-entry-note">
          <ShieldCheck size={17} aria-hidden="true" />
          Acceso simulado. No necesitas una contraseña ni credenciales reales.
        </p>
      </section>
    </main>
  );
}
