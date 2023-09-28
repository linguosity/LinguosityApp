import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    flexDirection: 'column',
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    textAlign: 'center',
  },
  name: {
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginBottom: 40,
  },
  story: {
    fontSize: 16,
    marginBottom: 40,
  },
  question: {
    fontSize: 16,
    marginBottom: 10,
  },
  answer: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
});

export default function MyDocument({ story, questions }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>The Story of Sid</Text>
        <Text style={styles.name}>Name: ______________________________</Text>
        <Text style={styles.story}>{story}</Text>
        <View>
          {questions.map((question, index) => (
            <View key={index}>
              <Text style={styles.question}>{`${index + 1}. ${question}`}</Text>
              <Text style={styles.answer}></Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
