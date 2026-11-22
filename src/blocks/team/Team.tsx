import Image from "next/image";
import { fields, mediaAlt, mediaUrl, type BlockProps, type InferBlockContent } from "@cmssy/react";
import { Section, SectionHead } from "@/components/ui/section";
import { anchorField, kickerField, isLightTone, toneField } from "@/lib/cmssy/fields";
import { ui } from "@/utils/ui-strings";

export type TeamContent = InferBlockContent<typeof teamProps>;

export const teamProps = {
  anchor: anchorField("zespol"),
  tone: toneField(),
  kicker: kickerField(),
  heading: fields.text({ label: "Nagłówek", required: true }),
  text: fields.textarea({ label: "Tekst obok nagłówka" }),
  members: fields.repeater({
    label: "Osoby",
    itemLabel: "Osoba",
    addButtonLabel: "Dodaj osobę",
    collapsible: true,
    itemSchema: {
      name: fields.text({ label: "Imię i nazwisko", required: true }),
      role: fields.text({ label: "Rola" }),
      bio: fields.textarea({ label: "Opis" }),
      photo: fields.media({
        label: "Zdjęcie",
        helperText:
          "Sylwetka bez tła (PNG z przezroczystością), pionowa ok. 4:5, kadr od głowy do pasa. Wycięcie: swift scripts/cutout.swift.",
        acceptedTypes: ["image"],
      }),
      profileUrl: fields.url({ label: "Link do profilu" }),
    },
  }),
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export default function Team({ content, context }: BlockProps<typeof teamProps>) {
  const members = content.members ?? [];
  const t = ui(context?.locale?.current);
  const columns = members.length > 1 ? "grid-cols-2" : "";

  return (
    <Section light={isLightTone(content.tone)} anchor={content.anchor} className="bg-panel">
      <SectionHead kicker={content.kicker} heading={content.heading} text={content.text} />

      {/* figures side by side on one backdrop, also on phones */}
      <div className={`stl-grid stl-stage grid border border-line ${columns}`}>
        {members.map((member, index) => {
          const photo = mediaUrl(member.photo);

          return (
            <div key={index} className="relative aspect-4/5 overflow-hidden md:aspect-1/1">
              <div
                aria-hidden="true"
                className="absolute inset-x-1/7 top-1/6 bottom-0 grid place-items-center rounded-t-full bg-amber-solid"
              >
                {photo ? null : (
                  <span className="font-mono text-header3-clamp text-on-solid">{initials(member.name)}</span>
                )}
              </div>
              {photo ? (
                <Image
                  src={photo}
                  alt={mediaAlt(member.photo) ?? member.name}
                  fill
                  sizes="(min-width: 77.75rem) 37rem, 50vw"
                  quality={85}
                  className="object-contain object-bottom"
                />
              ) : null}
            </div>
          );
        })}
      </div>

      <div className={`mt-8 grid gap-x-8 gap-y-10 md:mt-10 md:gap-x-14 ${members.length > 1 ? "md:grid-cols-2" : ""}`}>
        {members.map((member, index) => (
          <article key={index} className="min-w-0 border-t border-line pt-6">
            <h3 className="m-0 text-header4-clamp font-bold tracking-title">{member.name}</h3>
            {member.role ? (
              <p className="mt-2 mb-0 font-mono text-micro tracking-kicker text-amber uppercase">{member.role}</p>
            ) : null}
            {member.bio ? <p className="mt-4 mb-0 max-w-[34em] text-small text-mute">{member.bio}</p> : null}
            {member.profileUrl ? (
              <a href={member.profileUrl} className="mt-4 inline-block text-small font-bold underline hover:text-amber">
                {t.profile}
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </Section>
  );
}
