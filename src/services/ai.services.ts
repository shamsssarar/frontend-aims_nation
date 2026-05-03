import { httpClient } from "@/lib/axios/httpClient";

export const aiService = {
  askTutor: async (message: string, history: any[] = []) => {
    try {
      const response = (await httpClient.post("/api/v1/ai/ask", {
        message,
        history,
      })) as any;
      let text = "";

      if (typeof response === "string") {
        text = response;
      } else if (response?.data?.data) {
        text = response.data.data;
      } else if (response?.data) {
        text = response.data;
      } else if (response?.reply) {
        text = response.reply;
      }

      // Fallback: If it's an object we didn't expect, turn it into a string so it renders
      if (!text && typeof response === "object") {
        text = JSON.stringify(response);
      }

      return text || "I received a blank response.";
    } catch (error) {
      console.error("AI Tutor Error:", error);
      return "I'm sorry, my connection to the AiMS Nation servers was interrupted. Please try again.";
    }
  },
};
