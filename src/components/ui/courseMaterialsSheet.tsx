"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { materialService } from "@/services/material.services";
import { CourseMaterial } from "@/types/material.types";
import { FileText, Download, AlertCircle, FileQuestion } from "lucide-react";

// The props this drawer needs to function
interface CourseMaterialsSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string | null;
  courseTitle: string;
}

export function CourseMaterialsSheet({
  isOpen,
  onOpenChange,
  courseId,
  courseTitle,
}: CourseMaterialsSheetProps) {
  const [materials, setMaterials] = useState<CourseMaterial[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 👉 LAZY FETCHING: Only fetch when the drawer is actually opened!
  useEffect(() => {
    // If closed or no course selected, reset and do nothing
    if (!isOpen || !courseId) {
      setMaterials(null);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    materialService
      .getCourseMaterials(courseId)
      .then((data) => {
        if (isMounted) setMaterials(data);
      })
      .catch((err) => {
        console.error("Failed to load materials:", err);
        if (isMounted)
          setError("Unable to load course materials at this time.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, courseId]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      {/* We use a wider drawer (sm:max-w-md) to fit long PDF titles */}
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl text-primary">
            Classroom Materials
          </SheetTitle>
          <SheetDescription>
            Files and documents for{" "}
            <span className="font-semibold text-foreground">
              {courseTitle || "this course"}
            </span>
            .
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4">
          {/* STATE 1: Loading Skeleton */}
          {isLoading && (
            <>
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </>
          )}

          {/* STATE 2: Error Boundary */}
          {!isLoading && error && (
            <div className="flex flex-col items-center justify-center p-6 text-center bg-red-50 rounded-lg border border-red-100">
              <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
              <p className="text-sm text-red-600 font-medium">{error}</p>
              <Button
                variant="outline"
                className="mt-4 border-red-200 text-red-600 hover:bg-red-100"
                onClick={() => onOpenChange(false)}
              >
                Close Drawer
              </Button>
            </div>
          )}

          {/* STATE 3: The Empty State */}
          {!isLoading && !error && materials?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center opacity-80">
              <div className="bg-muted p-4 rounded-full mb-3">
                <FileQuestion className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">No files yet</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-62.5">
                Your instructor hasn't uploaded any materials for this course
                yet.
              </p>
            </div>
          )}

          {/* STATE 4: The Success Grid (Files) */}
          {!isLoading && !error && materials && materials.length > 0 && (
            <div className="space-y-3">
              {materials.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:border-primary hover:shadow-sm transition-all bg-card"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="bg-primary/10 p-2 rounded text-primary shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {file.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Added {new Date(file.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Secure Download / Open Link */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-secondary hover:text-secondary hover:bg-secondary/10 shrink-0 ml-2"
                    asChild
                  >
                    <a
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
