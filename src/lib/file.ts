export async function fileToDataUrl(file: File) {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  const maximumBytes = 4 * 1024 * 1024;
  if (!allowedTypes.includes(file.type)) throw new Error('JPG, PNG, WEBP 또는 PDF 파일만 등록할 수 있습니다.');
  if (file.size > maximumBytes) throw new Error('증빙 파일은 4MB 이하만 등록할 수 있습니다.');
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('파일을 읽지 못했습니다.'));
    reader.readAsDataURL(file);
  });
  return { dataUrl, name: file.name.slice(0, 200), mime: file.type, size: file.size };
}