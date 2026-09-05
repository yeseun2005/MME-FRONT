export const MAX_PROOF_BYTES = 1 * 1024 * 1024;

export const ALLOWED_PROOF_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

/** 문제가 없으면 null, 있으면 사용자에게 보여줄 메시지를 돌려준다. */
export function validateProofFile(file: File) {
  if (!ALLOWED_PROOF_TYPES.includes(file.type)) {
    return 'JPG, PNG, WEBP 또는 PDF 파일만 등록할 수 있습니다.';
  }
  if (file.size > MAX_PROOF_BYTES) {
    return `증빙 파일은 ${formatBytes(MAX_PROOF_BYTES)} 이하만 등록할 수 있습니다. (선택한 파일 ${formatBytes(file.size)})`;
  }
  return null;
}

export async function fileToDataUrl(file: File) {
  const invalid = validateProofFile(file);
  if (invalid) throw new Error(invalid);

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('파일을 읽지 못했습니다.'));
    reader.readAsDataURL(file);
  });

  return { dataUrl, name: file.name.slice(0, 200), mime: file.type, size: file.size };
}

export const MAX_VIDEO_BYTES = 500 * 1024 * 1024;

export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

export function validateVideoFile(file: File) {
  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
    return 'MP4, WEBM 또는 MOV 파일만 첨부할 수 있습니다.';
  }
  if (file.size > MAX_VIDEO_BYTES) {
    return `영상은 ${formatBytes(MAX_VIDEO_BYTES)} 이하만 첨부할 수 있습니다. (선택한 파일 ${formatBytes(file.size)})`;
  }
  return null;
}