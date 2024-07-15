interface IProps {}

export const HomeArrow: React.FC<IProps> = ({}) => {
  return (
    <>
      <svg
        width="160"
        height="160"
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-fade-right animate-once"
      >
        <path
          d="M133.333 80L93.3334 40M133.333 80L93.3334 120M133.333 80L63.3334 80M26.6667 80L43.3334 80"
          stroke="#CBD5E1"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
};
