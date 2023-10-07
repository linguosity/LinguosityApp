import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {

  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

export default function MyDocument({ pages }) {
  return (
    <Document>
      {
        pages.map((text, i) => (
          <Page key={i} size="A4" style={styles.page}>
            <View style={styles.section}>
              <Text>{text}</Text>
            </View>
          </Page>
        ))
      }
    </Document>
  )
}