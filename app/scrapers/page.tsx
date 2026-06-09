import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import MuiLink from "@mui/material/Link";
import NextLink from "@/components/NextLink";
import { listScrapers, type SpiderEntry } from "@/lib/scrapers";

const PLACEHOLDER = "—";

function placeholderCell(value?: string) {
  return value && value.length > 0 ? value : PLACEHOLDER;
}

export default async function ScrapersPage() {
  const { spiders } = await listScrapers();

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        City Scrapers
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mt: 3 }}>
        <Table aria-label="scrapers table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Slug/Spider Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Agency</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Last Run</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {spiders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No scraper output found in data/scrapers/.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              spiders.map((spider: SpiderEntry) => (
                <TableRow key={spider.slug} hover>
                  <TableCell>
                    <MuiLink
                      component={NextLink}
                      href={`/scrapers/${spider.slug}`}
                      underline="hover"
                    >
                      {spider.slug}
                    </MuiLink>
                  </TableCell>
                  <TableCell>{placeholderCell(spider.agency)}</TableCell>
                  <TableCell>
                    {placeholderCell(spider.last_run_status)}
                  </TableCell>
                  <TableCell>{placeholderCell(spider.last_run)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
