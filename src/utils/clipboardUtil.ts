export default class ClipboardUtil {
  private static clipboard = navigator.clipboard;

  static readText(): Promise<any> {
    return this.clipboard.readText();
  }

  static writeText(str: string): Promise<any> {
    return this.clipboard.writeText(str);
  }
}