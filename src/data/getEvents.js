import { supabase } from "../lib/supabase.js";

export async function getEvents() {
  const { data, error } = await supabase.from("events").select("*").order("date", { ascending: true });

  if (error) {
    throw new Error(`Kunne ikke hente events: ${error.message}`);
  }

  return (data ?? []).map((event) => {
    const slug = event.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    return {
      id: slug,
      title: event.title,
      date: event.date,
      dateText: event.date
        ? new Intl.DateTimeFormat("da-DK", {
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: "UTC",
          }).format(new Date(`${event.date}T12:00:00Z`))
        : "",
      time: event.time ?? "",
      place: event.location ?? "",
      price: event.price ?? "Se tilmelding",
      image: event.image_url || "/images/audience-talk.png",
      description: event.description ?? "",
      body: event.description ?? "",
      type: event.type ?? "Faellesskab",
      tag: event.type === "Faellesskab" ? "Fællesskab" : (event.type ?? "Fællesskab"),
    };
  });
}
