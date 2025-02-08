import React from "react";

interface SkeletonLoadingProps {
  className?: string;
}

const SkeletonBox: React.FC<SkeletonLoadingProps> = ({ className }) => {
  return <div className={`bg-gray-700 animate-pulse ${className}`}></div>;
};

interface SkeletonTextProps {
  className?: string;
}

const SkeletonText: React.FC<SkeletonTextProps> = ({ className }) => {
  return <div className={`bg-gray-700 animate-pulse ${className}`}></div>;
};

export { SkeletonBox, SkeletonText };
