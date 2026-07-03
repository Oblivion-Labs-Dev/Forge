export class GithubGateway {
  async fetchRepo(name: string) {
    return { name, cloneUrl: `github.com/${name}` };
  }
}
