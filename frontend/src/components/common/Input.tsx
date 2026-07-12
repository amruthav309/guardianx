type InputProps = {
  type?: string;
  placeholder: string;
};

function Input({
  type = "text",
  placeholder,
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="
      w-full
      p-4
      rounded-xl
      bg-zinc-900
      border
      border-zinc-700
      text-white
      outline-none
      focus:border-cyan-400
      transition"
    />
  );
}

export default Input;