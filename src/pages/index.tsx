import React, { useRef, useState } from "react";
import styles from "../styles/Home.module.css";

interface Participant {
    id: number;
    image: string;
}

const Index: React.FC = () => {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [winner, setWinner] = useState<Participant | null>(null);
    const [highlightedId, setHighlightedId] = useState<number | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const audioRef = useRef<HTMLAudioElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files).slice(0, 200 - participants.length);
            const newParticipants = filesArray.map((file, index) => ({
                id: participants.length + index + 1,
                image: URL.createObjectURL(file),
            }));
            setParticipants((prev) => [...prev, ...newParticipants]);
        }
    };

    const drawWinner = () => {
        if (participants.length > 0) {
            setIsDrawing(true);
            audioRef.current?.play(); // Play music
            let animationInterval: NodeJS.Timeout;

            const duration = 5000;
            const stepTime = 100;

            animationInterval = setInterval(() => {
                const randomIndex = Math.floor(Math.random() * participants.length);
                setHighlightedId(participants[randomIndex].id);
            }, stepTime);

            setTimeout(() => {
                clearInterval(animationInterval);
                const randomIndex = Math.floor(Math.random() * participants.length);
                const selectedWinner = participants[randomIndex];
                setWinner(selectedWinner);
                setParticipants((prev) =>
                    prev.filter((participant) => participant.id !== selectedWinner.id)
                );
                setHighlightedId(null);
                setIsDrawing(false);
                setShowModal(true);
            }, duration);
        }
    };

    const closeModal = () => {
        audioRef.current?.pause(); // Stop music
        audioRef.current?.load(); // Reset playback
        setShowModal(false);
    };

    const progress = (participants.length / 200) * 100;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Random Draw Game</h1>
                <div className={styles.headerActions}>
                    <form>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className={styles.uploadInput}
                        />
                    </form>
                    <button
                        className={styles.drawButton}
                        onClick={drawWinner}
                        disabled={participants.length === 0 || isDrawing}
                    >
                        Draw Winner
                    </button>
                </div>
                <div className={styles.progressContainer}>
                    <div className={styles.progressBar} style={{ width: `${progress}%` }} />
                    <p className={styles.progressText}>
                        {participants.length} / 200 Images
                    </p>
                </div>
            </header>

            <main className={styles.gridContainer}>
                {participants.map((participant) => (
                    <div
                        key={participant.id}
                        className={`${styles.participantCard} ${highlightedId === participant.id ? styles.highlighted : ""
                            }`}
                    >
                        <img
                            src={participant.image}
                            alt={`Participant ${participant.id}`}
                            className={styles.image}
                        />
                    </div>
                ))}
            </main>

            <audio ref={audioRef} src="/assets/music.mp3" />

            {showModal && winner && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h3 className={styles.h3}>🎉 We Have a Winner 🎉</h3>
                        <img
                            src={winner.image}
                            alt={`Winner ${winner.id}`}
                            className={styles.modalImage}
                        />
                        <p className={styles.p}>Winner ID: {winner.id}</p>
                        <button onClick={closeModal} className={styles.closeButton}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Index;
