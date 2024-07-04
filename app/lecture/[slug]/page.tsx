"use client";

import { useEffect, useState } from "react";
import { Lecture } from "../page";

export type Question = {
    name: string;
    question: string;
};

async function getLectureQuestions(slug: string): Promise<Question[]> {
    const url = `http://localhost:3001/${slug}`;
    try {
        const response = await fetch(url, { cache: "no-cache" });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json: Question[] = await response.json();
        return json;
    } catch (error) {
        return [];
    }
}

async function getLecture(slug: string): Promise<Lecture | undefined> {
    const url = `http://localhost:3001/lecture/${slug}`;
    try {
        const response = await fetch(url, { cache: "no-cache" });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json: Lecture = await response.json();
        return json;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

async function sendQuestion(lecture: string, q: Question): Promise<boolean> {
    const url = `http://localhost:3001/${lecture}`;
    try {
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            cache: "no-cache",
            body: JSON.stringify(q),
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export default function Page({
    params: { slug },
}: {
    params: { slug: string };
}) {
    const [name, setName] = useState("");
    const [refetch, setRefetch] = useState(true);
    const [question, setQuestion] = useState("");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [lecture, setLecture] = useState<Lecture | undefined>(undefined);

    useEffect(() => {
        const fetch_all = async () => {
            const questions = await getLectureQuestions(slug);
            const lecture = await getLecture(slug);
            setQuestions(questions);
            setLecture(lecture);
            setRefetch(false)
        };
        if (refetch) {
            fetch_all();
        }
    }, [refetch]);

    return (
        <>
            <div className="width-full grid grid-cols-2 gap-3 p-3">
                <div>
                    {!!questions.length &&
                        questions.map((question, id) => (
                            <div
                                key={id}
                                className="rounded-md shadow-xl bg-slate-400 text-black p-2  m-2 gap-2"
                            >
                                <h3 className="pl-2 text-xl">{question.question}</h3>
                                <h3 className="pl-2">{question.name}</h3>
                            </div>
                        ))}
                </div>
                <div>
                    {lecture?.active && (
                        <div className="flex flex-col gap-3">
                            <input
                                className="text-center rounded-lg shadow-xl text-xl  w-full h-12  border-2 border-white"
                                placeholder="Adiniz"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                            />
                            <textarea
                                className="rounded-lg shadow-xl text-xl  w-full h-24  border-2 border-white"
                                placeholder="Sorunuz"
                                value={question}
                                onChange={(e) => {
                                    setQuestion(e.target.value);
                                }}
                            />
                            <button
                                className="border-2 border-blue-300 bg-emerald-200 hover:border-dotted rounded-lg h-12 mx-12 hover:border-green-400"
                                onClick={async () => {
                                    if (name.trim() == "" || question.trim() == "") {
                                    } else {
                                        await sendQuestion(slug, { name, question });
                                        setName("");
                                        setQuestion("");
                                        setRefetch(true);
                                    }
                                }}
                            >
                                Sorunu gonder yayin sonunda cevaplamaya calisayim
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
