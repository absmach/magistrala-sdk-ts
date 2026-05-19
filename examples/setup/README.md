# Runnable Setup Examples

These examples create the prerequisite resources that each service needs before
calling the SDK methods. They keep local run state in `.runs/<run-id>.json`,
which is gitignored because it contains access tokens, client secrets, and PAT
secrets.

## E2E Runs

```bash
npx ts-node examples/setup/e2e.ts core
npx ts-node examples/setup/e2e.ts messaging
npx ts-node examples/setup/e2e.ts reports
npx ts-node examples/setup/e2e.ts all
```

The default run id is `local`, so separate commands resume the same state. Use
`MG_RUN_ID=<name>` or `--run-id=<name>` for isolated runs.

## Service Runs

Each service file can run independently and will create its own required
dependencies first:

```bash
npx ts-node examples/setup/clients.ts
npx ts-node examples/setup/channels.ts
npx ts-node examples/setup/groups.ts
npx ts-node examples/setup/reports.ts
```

## Configuration

Defaults match the existing examples:

- `MG_BASE_URL=http://localhost`
- `MG_AUTH_URL=http://localhost:9001`
- `MG_USERS_URL=http://localhost:9002`
- `MG_DOMAINS_URL=http://localhost:9003`
- `MG_GROUPS_URL=http://localhost:9004`
- `MG_CHANNELS_URL=http://localhost:9005`
- `MG_CLIENTS_URL=http://localhost:9006`
- `MG_RULES_URL=http://localhost:9008`
- `MG_READERS_URL=http://localhost:9011`
- `MG_BOOTSTRAP_URL=http://localhost:9013`
- `MG_REPORTS_URL=http://localhost:9017`
- `MG_CERTS_URL=http://localhost:9019`
- `MG_JOURNAL_URL=http://localhost:9021`
- `MG_ALARMS_URL=http://localhost:8050`
- `MG_HTTP_ADAPTER_URL=http://localhost/http`

Destructive calls such as delete, revoke, freeze, and delete-all are skipped
unless you set:

```bash
MG_RUN_DESTRUCTIVE=true
```
