import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const useProjectId = () => {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { projectSlug } = useParams();

  useEffect(() => {
    const loadProjectId = async () => {
      if (!projectSlug) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("projects")
          .select("id")
          .eq("slug", projectSlug)
          .maybeSingle();

        if (error) {
          console.error("Error loading project:", error);
        } else if (data) {
          setProjectId(data.id);
        }
      } catch (error) {
        console.error("Error loading project ID:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProjectId();
  }, [projectSlug]);

  return { projectId, loading };
};
