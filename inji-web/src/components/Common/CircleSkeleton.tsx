type CircleSkeletonProps = {
    size?: string;
    className?: string;
};

export const CircleSkeleton = ({
                                   size = 'w-20 h-20',
                                   className = '',
                               }: CircleSkeletonProps) => {
    return (
        <div
            className={`rounded-full bg-gray-300 animate-pulse ${size} ${className}`}
        />
    );
};
  