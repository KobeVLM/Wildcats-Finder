import { useState } from "react";
import Box from "@mui/material/Box";
import { Package } from "lucide-react";

// ! This is just a placeholder for now.


export function ImageWithFallback({ src, alt, ...props }) {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleError = () => {
        setHasError(true);
        setIsLoading(false);
    };

    const handleLoad = () => {
        setIsLoading(false);
    };

    if (!src || hasError) {
        return (
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f5f5f5",
                    color: "#888",
                    minHeight: 150,
                    ...props.sx,
                }}
                {...props}
            >
                <Package size={48} />
            </Box>
        );
    }

    return (
        <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
            {isLoading && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f5f5f5",
                        color: "#888",
                        minHeight: 150,
                    }}
                >
                    <Package size={48} />
                </Box>
            )}
            <Box
                component="img"
                src={src}
                alt={alt}
                onError={handleError}
                onLoad={handleLoad}
                sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: isLoading ? "none" : "block",
                    ...props.sx,
                }}
                {...props}
            />
        </Box>
    );
}
