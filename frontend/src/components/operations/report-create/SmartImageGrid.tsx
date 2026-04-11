// components/operations/report-create/SmartImageGrid.tsx
import { groupImagesIntoRows } from '../../../utils/imageLayoutUtils';
import type { LayoutImage, ImageRow } from '../../../utils/imageLayoutUtils';

interface SmartImageGridProps {
  images: LayoutImage[];
  showCaptions?: boolean;
  mode?: 'preview' | 'pdf';
}

const getRowHeight = (row: ImageRow, mode: 'preview' | 'pdf'): number => {
  if (mode === 'pdf') {
    if (row.cols === 3) return 200;
    if (row.cols === 2) return 190;
    return 180;
  }
  if (row.cols === 3) return 260;
  if (row.cols === 2) return 250;
  return 240;
};

const SmartImageGrid = ({
  images,
  showCaptions = true,
  mode = 'preview',
}: SmartImageGridProps) => {
  const rows = groupImagesIntoRows(images);

  if (images.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {rows.map((row, rowIdx) => {
        const rowHeight = getRowHeight(row, mode);

        return (
          <div
            key={rowIdx}
            style={{
              display: 'flex',
              gap: 8,
              height: rowHeight,
              justifyContent: row.centered ? 'center' : 'stretch',
              alignItems: 'stretch',
            }}
          >
            {row.images.map((img, imgIdx) => {
              // Portrait = narrower (flex 3), Landscape = wider (flex 4)
              const flexGrow = img.orientation === 'portrait' ? 3 : 4;

              // Centered single images: cap width so they don't go full width
              const singleMaxWidth =
                row.images.length === 1
                  ? img.orientation === 'portrait'
                    ? '33%'
                    : '55%'
                  : undefined;

              return (
                <div
                  key={imgIdx}
                  style={{
                    flex: row.centered ? '0 0 auto' : `${flexGrow} 0 0`,
                    maxWidth: singleMaxWidth,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* ✅ Fixed height image box — object-contain prevents stretch */}
                  <div
                    style={{
                      flex: 1,
                      overflow: 'hidden',
                      borderRadius: 8,
                      backgroundColor: '#f3f4f6',
                      border: '1px solid #e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={img.url}
                      alt={img.reason || 'Evidence image'}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',   // ✅ No stretch
                        objectPosition: 'center',
                        display: 'block',
                      }}
                    />
                  </div>

                  {/* Caption */}
                  {showCaptions && (
                    <p
                      style={{
                        fontSize: 11,
                        textAlign: 'center',
                        color: '#6b7280',
                        marginTop: 4,
                        fontStyle: 'italic',
                        lineHeight: 1.3,
                        minHeight: 16,
                      }}
                    >
                      {img.reason?.trim() || 'Image'}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default SmartImageGrid;