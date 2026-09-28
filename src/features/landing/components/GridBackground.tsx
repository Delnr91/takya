import React from "react";

export function GridBackground() {
  return (
    <div className="absolute inset-0 z-0 bg-marfil pointer-events-none">
      <div 
        className="absolute inset-0 w-full h-full opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm39 39V1H1v38h38z' fill='%23879F84' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
