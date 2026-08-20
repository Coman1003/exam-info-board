interface CurrentSubjectProps {
  subjectName: string;
}

export function CurrentSubject({ subjectName }: CurrentSubjectProps) {
  return (
    <section className="rounded-3xl bg-lavender px-8 py-10 text-center shadow-soft transition-soft">
      <div className="mb-2 text-lg font-medium text-text-light">📚 現在考試科目</div>
      <div className="animate-pulse-soft text-5xl font-bold text-text">{subjectName}</div>
    </section>
  );
}
