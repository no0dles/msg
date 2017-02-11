export class EnvironmentUtil {
  public static init(configEnvs: string[], envs: string | string[]) {
    for(let env in configEnvs) {
      EnvironmentUtil.setEnvironmentVariable(env);
    }

    if(!envs)
      return;

    if(envs instanceof Array) {
      for(let env of envs) {
        EnvironmentUtil.setEnvironmentVariable(env);
      }
    } else {
      EnvironmentUtil.setEnvironmentVariable(envs);
    }
  }

  public static setEnvironmentVariable(env: string) {
    const splitIndex = env.indexOf('=');
    if(splitIndex === -1)
      throw new Error(`invalid env variable '${env}'`);

    const key = env.substr(0, splitIndex);
    const value = env.substr(splitIndex+1);

    process.env[key] = value;
  }
}