import Image from "next/image";
import { fields, mediaAlt, mediaUrl, type BlockProps } from "@cmssy/react";
import { Section, SectionHeading } from "@/components/ui/section";
import { anchorField } from "@/lib/cmssy/fields";

export const teamProps = {
  anchor: anchorField("zespol"),
  heading: fields.text({ label: "Nagłówek", required: true }),
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

export default function Team({ content }: BlockProps<typeof teamProps>) {
  const members = content.members ?? [];

  return (
    <Section anchor={content.anchor} className="border-y border-line bg-white">
      <SectionHeading className="mb-8 md:mb-12">{content.heading}</SectionHeading>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
        {members.map((member, index) => {
          const photo = mediaUrl(member.photo);

          return (
            <div key={index} className="flex flex-col gap-6 sm:flex-row">
              {photo ? (
                <Image
                  src={photo}
                  alt={mediaAlt(member.photo) ?? member.name}
                  width={140}
                  height={170}
                  unoptimized
                  className="h-[10.625rem] w-35 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="h-[10.625rem] w-35 shrink-0 rounded-lg bg-soft"
                />
              )}
              <div className="min-w-0">
                <h3 className="m-0 text-header3-clamp font-medium tracking-[-0.015em]">
                  {member.name}
                </h3>
                {member.role ? (
                  <p className="mt-1 mb-0 font-bold">{member.role}</p>
                ) : null}
                {member.bio ? <p className="mt-3 mb-0">{member.bio}</p> : null}
                {member.profileUrl ? (
                  <a
                    href={member.profileUrl}
                    className="mt-3 inline-block underline"
                  >
                    Profil
                  </a>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
