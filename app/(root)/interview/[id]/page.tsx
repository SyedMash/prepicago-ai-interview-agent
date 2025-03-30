import React from "react";

const page = ({ params }: { params: { id: string } }) => {
  return (
    <section className="h-screen w-full flex items-center justify-center">
      {params.id}
    </section>
  );
};

export default page;
