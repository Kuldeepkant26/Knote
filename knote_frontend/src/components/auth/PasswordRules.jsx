import { Check, Circle } from "lucide-react";
import { PASSWORD_RULES } from "@/lib/passwordRules";

export default function PasswordRules({ value = "" }) {
  return (
    <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
      {PASSWORD_RULES.map((rule) => {
        const ok = rule.test(value);
        return (
          <li
            key={rule.key}
            className={`flex items-center gap-2 text-xs transition ${
              ok ? "text-success-600" : "text-mauve-400"
            }`}
          >
            {ok ? <Check size={14} /> : <Circle size={14} />}
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}
