import React from "react";

const DetailPage = ({ params }: { params: { slug: string } }) => {
  console.log(params);
  return (
    <div className="w-full h-full bg-gray-100 max-w-[1200px] mx-auto ">
      {params.slug}
    </div>
  );
};

export default DetailPage;
