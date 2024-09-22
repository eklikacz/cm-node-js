import mongoose from 'mongoose';

export class SessionStatic {
  private static session: mongoose.ClientSession | null = null;

  public static getSession () {
    return SessionStatic.session as mongoose.ClientSession;
  }

  public static setSession (session: mongoose.ClientSession) {
    SessionStatic.session = session;
  }

  public static clean () {
    SessionStatic.session = null;
  }
}
