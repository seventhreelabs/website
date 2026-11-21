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
      photo: fields.media({ label: "Zdjęcie", acceptedTypes: ["image"] }),
      profileUrl: fields.url({ label: "Link do profilu" }),
    },
  }),
};

// avatar tile colours alternate when there is no photo
const TILES = ["bg-amber", "bg-blush"];

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

  return (
    <Section light={isLightTone(content.tone)} anchor={content.anchor} className="bg-panel">
      <SectionHead kicker={content.kicker} heading={content.heading} text={content.text} />
      <div className="grid gap-3.5 lg:grid-cols-2">
        {members.map((member, index) => {
          const photo = mediaUrl(member.photo);

          return (
            <article
              key={index}
              className="grid grid-cols-[3.25rem_1fr] items-start gap-4.5 bg-lift p-5 sm:grid-cols-[4rem_1fr] sm:p-7"
            >
              {photo ? (
                <Image
                  src={photo}
                  alt={mediaAlt(member.photo) ?? member.name}
                  width={128}
                  height={128}
                  quality={85}
                  className="size-13 object-cover sm:size-16"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className={`grid size-13 place-items-center font-mono text-body text-pitch sm:size-16 ${TILES[index % TILES.length]}`}
                >
                  {initials(member.name)}
                </div>
              )}
              <div className="min-w-0">
                <h3 className="mt-0.5 mb-1 text-body font-bold tracking-title">{member.name}</h3>
                {member.role ? (
                  <p className="m-0 font-mono text-micro text-amber uppercase">{member.role}</p>
                ) : null}
                {member.bio ? <p className="mt-3 mb-0 text-small text-mute">{member.bio}</p> : null}
                {member.profileUrl ? (
                  <a href={member.profileUrl} className="mt-3 inline-block text-small font-bold underline hover:text-amber">
                    {t.profile}
                  </a>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
