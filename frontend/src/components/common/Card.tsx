import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function Card({ children }: Props) {
  return (
    <div
      className="
      bg-zinc-900/80
      border
      border-zinc-700
      rounded-3xl
      p-8
      backdrop-blur-lg
      shadow-xl"
    >
      {children}
    </div>
  );
}

export default Card;