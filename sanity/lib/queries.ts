import { defineQuery } from "next-sanity";

/** Site identity and chrome from the `settings` singleton. */
export const settingsQuery = defineQuery(`*[_id == "settings"][0]{
  title,
  description,
  intro,
  navigation[]{ label, href },
  socialLinks[]{ label, url }
}`);
