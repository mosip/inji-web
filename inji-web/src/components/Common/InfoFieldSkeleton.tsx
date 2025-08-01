type InfoFieldSkeletonProps = {
    width?: string;
    height?: string;
    className?: string;
};

export const InfoFieldSkeleton = ({
                                      width = 'w-full',
                                      height = 'h-4',
                                      className = '',
                                  }: InfoFieldSkeletonProps) => {
    return (
        <div
            className={`bg-gray-300 rounded animate-pulse ${width} ${height} ${className}`}
        />
    );
};
  