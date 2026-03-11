"use client";
import { useState } from 'react';
import React, { PropsWithChildren } from 'react';

function TextExpander({ children }: PropsWithChildren) {
  const [isExpanded, setIsExpanded] = useState(false);
  const arr = String(children).split(" ").length / 2

  console.log('LENN', arr)
  const displayText = isExpanded
    ? children
    : String(children).split(' ').slice(0, Number(arr)).join(' ') + '...';

  return (
    <span>
      {displayText}{' '}
      <button
        className='text-primary-700 border-b border-primary-700 leading-3 pb-1'
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? 'Show less' : 'Show more'}
      </button>
    </span>
  );
}

export default TextExpander;
