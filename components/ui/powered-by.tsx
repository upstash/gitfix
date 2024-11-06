import React from "react";
import Link from "next/link";

const PoweredBy: React.FC = () => {
  return (
    <div>
      <p>Automated grammar correction application</p>
      <div>
        <Link
          href="https://upstash.com/docs/qstash/workflow/getstarted"
          target="_blank"
          rel="noopener noreferrer"
        >
          Built using Upstash Workflow
        </Link>
        <span>•</span>
        <Link
          href="https://github.com/upstash/DegreeGuru"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source Code
        </Link>
      </div>
    </div>
  );
};

export default PoweredBy;
