export const convertToSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD") // Tách các ký tự tiếng Việt có dấu
    .replace(/[\u0300-\u036f]/g, "") // Xóa dấu
    .replace(/[đĐ]/g, "d") // Thay đĐ thành d
    .replace(/([^a-z0-9\s-]|_)+/g, "") // Loại bỏ các ký tự đặc biệt trừ khoảng trắng và dấu gạch ngang
    .trim()
    .replace(/\s+/g, "-") // Thay khoảng trắng bằng dấu gạch ngang
    .replace(/-+/g, "-"); // Thay nhiều dấu gạch ngang liên tiếp bằng một dấu gạch ngang
};
