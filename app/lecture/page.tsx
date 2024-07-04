import Link from "next/link";

export type Lecture = {
  name: string;
  active: boolean;
};

async function getLectures(): Promise<Lecture[]> {
  const url = `http://localhost:3001/lectures`;
  try {
    const response = await fetch(url, { cache: "no-cache" });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json: Lecture[] = await response.json();
    return json;
  } catch (error) {
    return [];
  }
}

export default async function Page() {
  const lectures = await getLectures();
  return (
    <>
      <div className="grid grid-cols-3">
        {!!lectures.length &&
          lectures.map((lecture, id) => (
            <Link
              href={`/lecture/${lecture.name}`}
              key={id}
              className="flex justify-between align-middle h-full rounded-md shadow-xl bg-slate-400 text-black p-2  m-2 gap-2"
            >
              <h3 className="p-2 h-full flex text-2xl items-center justify-self-center">
                Ders - {lecture.name}
              </h3>
              <h3 className="p-2 h-full bg-blue-300 rounded flex items-center justify-self-center">
                {lecture.active ? "Devam Ediyor" : "Bitti"}
              </h3>
            </Link>
          ))}
      </div>
    </>
  );
}
