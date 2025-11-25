// src/components/BrandStory.tsx
import React from 'react';

interface Props {
    title?: string;
    paragraphs: string[];
}

const BrandStory: React.FC<Props> = ({ title = '关于 Bloom Patisserie', paragraphs }) => {
    return (
        <div id="story" className="brand-story container">
            <h2 className="story-title">{title}</h2>
            <div className="story-content">
                {paragraphs.map((p, i) => (
                    <p key={i} className="story-paragraph">
                        {p}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default BrandStory;
