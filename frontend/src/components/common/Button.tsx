type ButtonProps = {
  title: string;
  onClick?: () => void;
};

function Button({ title, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
      bg-cyan-400
      hover:bg-cyan-300
      duration-300
      px-8
      py-3
      rounded-xl
      text-black
      font-semibold
      shadow-lg
      hover:scale-105"
    >
      {title}
    </button>
  );
}

export default Button;