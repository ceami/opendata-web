// StatusBadge 컴포넌트 수정
export const StatusBadge = ({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: string; // "API" | "file" | "default" 대신 string 사용
}) => {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-[5px] text-xs font-light ${
        getVariantStyles(variant).className
      }`}
    >
      {children}
    </span>
  );
};

export const getVariantStyles = (variant: string) => {
  switch (variant) {
    case "API":
      return {
        title: "오픈 API",
        className:
          "bg-[#009689] border-[#00ddca] text-white border rounded-[5px]",
      };
    case "file":
      return {
        title: "파일",
        className: "bg-blue-100 text-blue-800",
      };
    default:
      return {
        title: "기본",
        className: "bg-gray-100 text-gray-800",
      };
  }
};
