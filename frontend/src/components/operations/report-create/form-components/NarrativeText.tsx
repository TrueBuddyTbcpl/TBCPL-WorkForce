interface NarrativeTextProps {
  text: string;
  onChange: (text: string) => void;
}

export function NarrativeText({ text, onChange }: NarrativeTextProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Narrative Text
      </label>
      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        rows={6}
        placeholder="Enter detailed narrative text here..."
      />
    </div>
  );
}
