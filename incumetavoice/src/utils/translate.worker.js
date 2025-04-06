import { pipeline } from '@xenova/transformers';

class MyTranslationPipeline {
    static task = 'translation';
    static model = 'Xenova/nllb-200-distilled-600M'; // Balanced model
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = await pipeline(this.task, this.model, {
                quantized: true, // 🔧 Use quantization for better speed & memory
                progress_callback
            });
        }
        return this.instance;
    }
}

self.addEventListener('message', async (event) => {
    const { text, src_lang, tgt_lang } = event.data;

    // Start pipeline init early
    let translator;
    try {
        translator = await MyTranslationPipeline.getInstance(x => {
            self.postMessage({ status: 'loading', ...x });
        });
    } catch (err) {
        self.postMessage({ status: 'error', message: err.message });
        return;
    }

    try {
        // 🔁 Stream output for better UX
        const output = await translator(text, {
            src_lang,
            tgt_lang,
            callback_function: tokens => {
                const partial = translator.tokenizer.decode(tokens[0].output_token_ids, { skip_special_tokens: true });
                self.postMessage({ status: 'partial', output: partial });
            }
        });

        self.postMessage({
            status: 'complete',
            output
        });

    } catch (err) {
        self.postMessage({ status: 'error', message: err.message });
    }
});
