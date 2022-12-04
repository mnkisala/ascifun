use image::{GenericImageView, Pixel};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct AscifyConfig {
    ramp: String,
    pub inverse_ramp: bool,
    pub columns: u32,
}

#[wasm_bindgen]
impl AscifyConfig {
    #[wasm_bindgen(constructor)]
    pub fn new(ramp: String, inverse_ramp: bool, columns: u32) -> Self {
        Self {
            ramp,
            inverse_ramp,
            columns,
        }
    }

    #[wasm_bindgen(getter)]
    pub fn ramp(&self) -> String {
        self.ramp.clone()
    }

    #[wasm_bindgen(setter)]
    pub fn set_ramp(&mut self, ramp: String) {
        self.ramp = ramp;
    }
}

#[wasm_bindgen]
pub fn ascify(data: String, config: AscifyConfig) -> String {
    console_error_panic_hook::set_once();

    let raw = base64::decode(&data).unwrap();
    let img = image::load_from_memory(&raw).unwrap();

    let ratio = img.width() as f32 / img.height() as f32;
    let width = config.columns.min(img.width());
    let height = (width as f32 * ratio) as u32;

    let img = img.resize(width, height, image::imageops::FilterType::Gaussian);
    let ramp = if !config.inverse_ramp {
        config.ramp
    } else {
        config.ramp.chars().rev().collect()
    };

    let mut output = String::with_capacity((width as usize + 1) * height as usize);

    for y in 0..height {
        for x in 0..height {
            let pixel = img.get_pixel(x, y);
            let luma = pixel.to_luma().0[0];

            let ramp_len = ramp.len();
            let index = (luma as f32 / 255.0) * ramp_len as f32;
            let index = index as usize % ramp_len;

            let c = ramp.chars().nth(index).unwrap();
            output.push(c);
        }
        output.push('\n');
    }

    output
}
